import net from "net";
import { execFileSync, spawn } from "child_process";
import { config } from "./config";
import { logger } from "./logger";

let tunnelReady: Promise<void> | undefined;
let sftpTunnelReady: Promise<void> | undefined;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isLocalDbHost(): boolean {
  return config.database.host === "localhost" || config.database.host === "127.0.0.1";
}

export function isPortOpen(host: string, port: number, timeoutMs = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const finish = (open: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

export function isDbPortOpen(timeoutMs = 1500): Promise<boolean> {
  return isPortOpen(config.database.host, config.database.port, timeoutMs);
}

export function resolveBastionInstanceId(): string {
  const output = execFileSync(
    "aws",
    [
      "ec2",
      "describe-instances",
      "--filters",
      `Name=tag:Name,Values=${config.ssm.bastionTag}`,
      "--query",
      "Reservations[].Instances[?State.Name=='running'].InstanceId",
      "--output",
      "text",
      "--region",
      config.ssm.region,
    ],
    {
      encoding: "utf8",
      env: { ...process.env, AWS_PROFILE: config.ssm.awsProfile },
    },
  ).trim();
  const instanceId = output.split(/\s+/).find((value) => value.startsWith("i-"));
  if (!instanceId) {
    throw new Error(`No running bastion found for tag ${config.ssm.bastionTag}`);
  }
  return instanceId;
}

function startSsmSession(): void {
  const bastionId = resolveBastionInstanceId();
  logger.info(
    `Starting SSM DB tunnel: localhost:${config.ssm.localPort} -> ${config.ssm.remoteHost}:${config.ssm.remotePort} via ${bastionId}`,
  );
  spawn(
    "aws",
    [
      "ssm",
      "start-session",
      "--target",
      bastionId,
      "--region",
      config.ssm.region,
      "--document-name",
      "AWS-StartPortForwardingSessionToRemoteHost",
      "--parameters",
      JSON.stringify({
        portNumber: [String(config.ssm.remotePort)],
        localPortNumber: [String(config.ssm.localPort)],
        host: [config.ssm.remoteHost],
      }),
    ],
    {
      stdio: "ignore",
      detached: true,
      env: { ...process.env, AWS_PROFILE: config.ssm.awsProfile },
    },
  ).unref();
}

export async function ensureDbTunnel(): Promise<void> {
  if (!isLocalDbHost()) return;
  if (await isDbPortOpen()) return;
  if (!tunnelReady) {
    tunnelReady = (async () => {
      startSsmSession();
      const deadline = Date.now() + 40_000;
      while (Date.now() < deadline) {
        if (await isDbPortOpen()) {
          logger.info(`SSM DB tunnel is ready on localhost:${config.database.port}`);
          return;
        }
        await wait(1000);
      }
      tunnelReady = undefined;
      throw new Error(
        `Database tunnel is not listening on localhost:${config.database.port}. Start it with: bash scripts/ssm-db-tunnel.sh`,
      );
    })();
  }
  await tunnelReady;
}

export function resetDbTunnel(): void {
  tunnelReady = undefined;
}

function startSftpSsmSession(): void {
  const bastionId = resolveBastionInstanceId();
  const localPort = String(config.ssm.sftpLocalPort);
  logger.info(
    `Starting SSM SFTP tunnel: localhost:${localPort} -> ${config.ssm.sftpRemoteHost}:${config.ssm.sftpRemotePort} via ${bastionId}`,
  );
  spawn(
    "aws",
    [
      "ssm",
      "start-session",
      "--target",
      bastionId,
      "--region",
      config.ssm.region,
      "--document-name",
      "AWS-StartPortForwardingSessionToRemoteHost",
      "--parameters",
      JSON.stringify({
        portNumber: [String(config.ssm.sftpRemotePort)],
        localPortNumber: [localPort],
        host: [config.ssm.sftpRemoteHost],
      }),
    ],
    {
      stdio: "ignore",
      detached: true,
      env: { ...process.env, AWS_PROFILE: config.ssm.awsProfile },
    },
  ).unref();
}

export async function ensureSftpTunnel(): Promise<void> {
  const port = Number(config.ssm.sftpLocalPort);
  if (await isPortOpen("127.0.0.1", port)) return;
  if (!sftpTunnelReady) {
    sftpTunnelReady = (async () => {
      startSftpSsmSession();
      const deadline = Date.now() + 40_000;
      while (Date.now() < deadline) {
        if (await isPortOpen("127.0.0.1", port)) {
          logger.info(`SSM SFTP tunnel is ready on localhost:${port}`);
          return;
        }
        await wait(1000);
      }
      sftpTunnelReady = undefined;
      throw new Error(
        `SFTP tunnel is not listening on localhost:${port}. Forward ${config.ssm.sftpRemoteHost}:${config.ssm.sftpRemotePort} with the bastion session.`,
      );
    })();
  }
  await sftpTunnelReady;
}

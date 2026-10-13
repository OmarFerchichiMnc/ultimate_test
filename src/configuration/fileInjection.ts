import fs from "fs";
import path from "path";
import SftpClient from "ssh2-sftp-client";
import { Page } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { config } from "./config";
import { logger } from "./logger";
import { ensureDbTunnel, ensureSftpTunnel } from "./ssmTunnel";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class BastionSsmForward extends TestPoint {
  constructor() {
    super("TP0005", "Start SSM Port Forwarding to Bastion (non-blocking)", async () => {
      await ensureDbTunnel();
      await ensureSftpTunnel();
    });
  }
}

export class PrepareUpload extends TestPoint {
  constructor(filePath: string, remotePath: string, fileName: string) {
    super("TP1001", "Validate local and remote paths for SFTP upload", async () => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Local path not found: ${filePath}`);
      }
      const fullFile = path.join(filePath, fileName);
      if (!fs.existsSync(fullFile)) {
        throw new Error(`File not found: ${fullFile}`);
      }
      if (!remotePath) {
        throw new Error("Remote path is invalid");
      }
      logger.info(`File ready for upload: ${fullFile}`);
    });
  }
}

export class ExecuteUpload extends TestPoint {
  constructor(filePath: string, remotePath: string, fileName: string) {
    super("TP1002", "Execute SFTP upload", async () => {
      if (!config.sftp.user || !config.sftp.password) {
        throw new Error("SFTP credentials are missing. Set SFTP_USER and SFTP_PASSWORD in .env");
      }
      await ensureSftpTunnel();
      const client = new SftpClient();
      await client.connect({
        host: "127.0.0.1",
        port: Number(config.ssm.sftpLocalPort),
        username: config.sftp.user,
        password: config.sftp.password,
      });
      try {
        const localFile = path.join(filePath, fileName);
        const remoteFile = `${remotePath.replace(/\/$/, "")}/${fileName}`;
        logger.info(`Uploading ${localFile} -> ${remoteFile}`);
        await client.put(localFile, remoteFile);
      } finally {
        await client.end();
      }
      logger.info("Files uploaded successfully");
    });
  }
}

export class WaitForFileInjection extends TestPoint {
  constructor() {
    super("TP0004", "Wait for file injection", async () => {
      logger.info("Waiting for ingestion");
      await wait(120_000);
      logger.info("Done waiting");
    });
  }
}

export class InjectFile extends TestPoint {
  constructor(filePath: string, remotePath: string, fileName: string) {
    super("TP1002", "Execute SFTP upload", async (page: Page) => {
      await new BastionSsmForward().run(page);
      await new PrepareUpload(filePath, remotePath, fileName).run(page);
      await new ExecuteUpload(filePath, remotePath, fileName).run(page);
      await new WaitForFileInjection().run(page);
    });
  }
}

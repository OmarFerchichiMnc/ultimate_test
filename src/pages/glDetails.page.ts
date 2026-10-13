import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class GlDetailsPage extends BasePage {
  static readonly path = "/gl-details";
  static testPoints(): TestPoint[] {
    return [
      new OpenGlDetailsPage(),
      new InspectGlDetailsSearch(),
    ];
  }

  readonly search: Locator;

  constructor(page: Page) {
    super(page, GlDetailsPage.path);
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenGlDetailsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-GL_DETAILS", "Open /gl-details", async (page) => {
      const pom = new GlDetailsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectGlDetailsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-GL_DETAILS-01",
      "Inspect \"Search\" on /gl-details",
      async (page) => {
        const pom = new GlDetailsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-GL_DETAILS-01 Search on /gl-details");
      },
      "*****",
      "ready",
    );
  }
}


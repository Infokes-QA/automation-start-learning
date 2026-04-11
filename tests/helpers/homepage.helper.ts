import { Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { env } from "../../config/env.config";

export class HomePageHelper {

  static async mapsToHomePage(homePage: HomePage): Promise<void> {
    await homePage.mapsToHomePage();
  }
}
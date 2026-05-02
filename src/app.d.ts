declare global {
  namespace App {
    interface Locals {
      siteId: string;
      siteKey: string;
      isPreview: boolean;
    }
  }
}

export {};

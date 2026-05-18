declare global {
  namespace App {
    interface Locals {
      user: import('$lib/server/auth/types').SessionUser | null;
    }
  }
}

export {};

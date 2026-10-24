/**
 * Lightweight hash-based client-side router
 */

export class Router {
  constructor(routes, containerId = "view") {
    this.routes = routes;
    this.containerId = containerId;
    this.currentCleanups = [];

    window.addEventListener("hashchange", () => this.resolve());
    window.addEventListener("load", () => this.resolve());
  }

  get container() {
    return document.getElementById(this.containerId);
  }

  resolve() {
    const rawHash = window.location.hash || "#/";
    const path = rawHash.replace(/^#/, "") || "/";

    // Update active state in nav
    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href === rawHash || (href === "#/" && (rawHash === "#" || rawHash === ""))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const targetEl = this.container;
    if (!targetEl) return;

    // Match route
    for (const route of this.routes) {
      const match = this.matchRoute(route.pattern, path);
      if (match) {
        route.render(targetEl, match.params);
        return;
      }
    }

    // Fallback: route not found
    const fallback = this.routes.find((r) => r.pattern === "*");
    if (fallback) {
      fallback.render(targetEl, {});
    }
  }

  matchRoute(pattern, path) {
    if (pattern === "*") return { params: {} };

    // Convert pattern like "/area/:id" into regex
    const paramNames = [];
    const regexPattern = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);

    if (!match) return null;

    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = decodeURIComponent(match[index + 1]);
    });

    return { params };
  }
}

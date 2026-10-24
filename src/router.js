import { areas } from './data/problems.js';

/**
 * Lightweight hash-based client-side router
 */
export class Router {
  constructor(routes, containerId = "view") {
    this.routes = routes;
    this.containerId = containerId;

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
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    const targetEl = this.container;
    if (!targetEl) return;

    // Match route
    for (const route of this.routes) {
      const match = this.matchRoute(route.pattern, path);
      if (match) {
        this.updateDocumentTitle(route.pattern, match.params);
        route.render(targetEl, match.params);
        return;
      }
    }

    // Fallback: route not found
    const fallback = this.routes.find((r) => r.pattern === "*");
    if (fallback) {
      document.title = "DSA Souls | Lost in the Dark";
      fallback.render(targetEl, {});
    }
  }

  updateDocumentTitle(pattern, params) {
    if (pattern === "/") {
      document.title = "DSA Souls | The Journey";
    } else if (pattern === "/notes") {
      document.title = "DSA Souls | Bonfire Notes";
    } else if (pattern === "/side-quest") {
      document.title = "DSA Souls | Archdragon Peak";
    } else if (pattern === "/area/:id") {
      const area = areas.find((a) => a.id === params.id);
      document.title = area ? `DSA Souls | Area ${area.order}: ${area.name}` : "DSA Souls | Area";
    } else {
      document.title = "DSA Souls";
    }
  }

  matchRoute(pattern, path) {
    if (pattern === "*") return { params: {} };

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

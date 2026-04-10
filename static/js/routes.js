/**
 * Client-side Router Management
 * Routes: /home, /login, /register, /verify, /jobs, /applications, /profile, /404
 * Follows clean architecture with separation of concerns
 */

const ROUTES = {
    HOME: "/home",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY: "/verify",
    JOBS: "/jobs",
    APPLICATIONS: "/applications",
    PROFILE: "/profile",
    NOT_FOUND: "/404",
};

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeRouteChange = [];
        this.afterRouteChange = [];
    }

    /**
     * Register a route handler
     * @param {string} path - Route path (e.g., '/home')
     * @param {Function} handler - Render function
     * @param {Object} config - Route configuration
     */
    register(path, handler, config = {}) {
        this.routes.set(path, { handler, config, path });
    }

    /**
     * Navigate to a route
     * @param {string} path - Target path
     * @param {Object} options - Navigation options
     */
    navigate(path, options = {}) {
        const normalizedPath = this.normalizePath(path);
        const currentPath = this.normalizePath(window.location.pathname);

        // Avoid unnecessary re-renders
        if (currentPath === normalizedPath && !options.force) {
            return;
        }

        // Run before hooks
        for (const hook of this.beforeRouteChange) {
            if (hook(normalizedPath) === false) return;
        }

        // Update history
        if (options.replace) {
            window.history.replaceState({ path: normalizedPath }, "", normalizedPath);
        } else {
            window.history.pushState({ path: normalizedPath }, "", normalizedPath);
        }

        this.render(normalizedPath);

        // Run after hooks
        for (const hook of this.afterRouteChange) {
            hook(normalizedPath);
        }
    }

    /**
     * Render the current route
     * @param {string} path - Route path to render
     */
    render(path) {
        const normalizedPath = this.normalizePath(path);
        const route = this.routes.get(normalizedPath);

        if (!route) {
            this.renderNotFound(normalizedPath);
            return;
        }

        this.currentRoute = normalizedPath;
        try {
            route.handler();
            this.updateActiveNavLink(normalizedPath);
        } catch (error) {
            console.error(`Error rendering route ${normalizedPath}:`, error);
            showToast("Lỗi khi tải trang", true);
        }
    }

    /**
     * Render 404 page
     * @param {string} attemptedPath - Path that was not found
     */
    renderNotFound(attemptedPath) {
        const main = document.querySelector("main.layout");
        if (!main) return;

        main.innerHTML = `
      <div class="not-found-container text-center py-20">
        <h1 class="text-4xl font-bold text-white mb-4">404</h1>
        <p class="text-white/70 mb-6">Trang không tìm thấy: <code class="text-brand-accent">${attemptedPath}</code></p>
        <button class="btn btn-primary" onclick="router.navigate('/home')">
          Quay lại trang chủ
        </button>
      </div>
    `;
    }

    /**
     * Normalize route path
     * @param {string} path - Path to normalize
     * @returns {string} Normalized path
     */
    normalizePath(path = window.location.pathname) {
        if (!path || path === "") return "/home";
        if (path === "/") return "/home";
        return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    }

    /**
     * Update active navigation link styling
     * @param {string} path - Current path
     */
    updateActiveNavLink(path) {
        document.querySelectorAll("[data-route]").forEach((link) => {
            const linkRoute = link.getAttribute("data-route");
            if (linkRoute === path) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    /**
     * Register a before-route-change hook
     * @param {Function} callback - Callback function
     */
    onBeforeRouteChange(callback) {
        this.beforeRouteChange.push(callback);
    }

    /**
     * Register an after-route-change hook
     * @param {Function} callback - Callback function
     */
    onAfterRouteChange(callback) {
        this.afterRouteChange.push(callback);
    }

    /**
     * Get current route
     * @returns {string} Current route path
     */
    getCurrentRoute() {
        return this.normalizePath();
    }

    /**
     * Check if current route is authenticated-only
     * @returns {boolean}
     */
    requiresAuth(path) {
        const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.VERIFY, ROUTES.JOBS, ROUTES.NOT_FOUND];
        return !publicRoutes.includes(path);
    }
}

// Create global router instance
const router = new Router();

// Setup browser back/forward button handling
window.addEventListener("popstate", () => {
    const path = router.normalizePath(window.location.pathname);
    router.render(path);
});

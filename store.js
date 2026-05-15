// ============================================================
// ROUTER – Hash-based SPA navigation
// ============================================================

const Router = (() => {
  const routes = {};
  let currentRoute = null;

  const register = (path, handler) => { routes[path] = handler; };

  const navigate = (path) => {
    window.location.hash = path;
  };

  const resolve = () => {
    const hash = window.location.hash.slice(1) || '/';
    const route = routes[hash];
    if (route) {
      currentRoute = hash;
      route();
      updateNavHighlight(hash);
    } else {
      // Fallback to home
      navigate('/');
    }
  };

  const updateNavHighlight = (hash) => {
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('data-route');
      link.classList.toggle('active', href === hash);
    });
  };

  const getCurrentRoute = () => currentRoute;

  const init = () => {
    window.addEventListener('hashchange', resolve);
    resolve();
  };

  return { register, navigate, resolve, getCurrentRoute, init };
})();

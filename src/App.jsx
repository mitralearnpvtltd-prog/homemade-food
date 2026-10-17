
import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import SeoPage from "./pages/SeoPage.jsx";
import { seoPages } from "./data/seoPages.js";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <section className="content">
      <h1>Page not found</h1>

      <p className="intro">
        That page does not exist.{" "}
        <Link to="/food/homemade-food/bangalore/">
          Explore Homemade Food in Bangalore
        </Link>
        .
      </p>
    </section>
  );
}

export default function App() {
  const homeFoodPage = seoPages.find(
    (page) => page.url === "/food/homemade-food/bangalore/"
  );

  return (
    <>
      <ScrollToTop />

      <Header />

      <main>
        <Routes>
          {/* Redirect the homepage to Homemade Food in Bangalore */}
          <Route
            path="/"
            element={
              homeFoodPage ? (
                <Navigate
                  to="/food/homemade-food/bangalore/"
                  replace
                />
              ) : (
                <NotFound />
              )
            }
          />

          {/* Automatically register every SEO page */}
          {seoPages
            .filter((page) => page.url !== "/")
            .map((page) => (
              <Route
                key={page.url}
                path={page.url}
                element={<SeoPage page={page} />}
              />
            ))}

          {/* Display a fallback for unknown URLs */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

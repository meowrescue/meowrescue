import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.js";
import About from "./pages/About.js";
import Cats from "./pages/Cats.js";
import Adopt from "./pages/Adopt.js";
import AdoptionForm from "./pages/AdoptionForm.js";
import Blog from "./pages/Blog.js";
import Events from "./pages/Events.js";
import Resources from "./pages/Resources.js";
import Contact from "./pages/Contact.js";

const AppShellForSSG = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/cats" element={<Cats />} />
      <Route path="/adopt" element={<Adopt />} />
      <Route path="/adopt/apply" element={<AdoptionForm />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/events" element={<Events />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);

export default AppShellForSSG;

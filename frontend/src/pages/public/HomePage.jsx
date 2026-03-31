import React, { useState, useEffect } from 'react';
import { publicAPI } from '../../utils/api';
import HeroSection from '../../components/public/HeroSection';
import AboutSection from '../../components/public/AboutSection';
import ProjectsSection from '../../components/public/ProjectsSection';
import SkillsSection from '../../components/public/SkillsSection';
import { ExperienceSection } from '../../components/public/ExperienceSection';
import BlogSection from '../../components/public/BlogSection';
import ContactSection from '../../components/public/ContactSection';

export default function HomePage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    publicAPI.getSettings()
      .then(({ data }) => setSettings(data.data || {}))
      .catch(console.error);
  }, []);

  const sectionsOrder = settings.sections_order || ['hero','about','projects','skills','experience','blog','contact'];
  const sectionsVisible = settings.sections_visible || {};

  const SECTION_MAP = {
    hero:       <HeroSection key="hero" settings={settings} />,
    about:      <AboutSection key="about" settings={settings} />,
    projects:   <ProjectsSection key="projects" />,
    skills:     <SkillsSection key="skills" />,
    experience: <ExperienceSection key="experience" />,
    blog:       <BlogSection key="blog" />,
    contact:    <ContactSection key="contact" settings={settings} />,
  };

  return (
    <>
      {sectionsOrder.map(key =>
        sectionsVisible[key] !== false ? SECTION_MAP[key] : null
      )}
    </>
  );
}

# SPLMNS Frontend Developer Assignment — Requirements

## 🎯 Objective

Build a simple web-based application with two views. The user should be able to input a name or short phrase, which will then be animated across a fixed-aspect-ratio screen in a visually engaging way.

---

## 📁 Project Structure

### View 1: Input Screen

- Simple centered layout
- Input field for user to enter a name or short phrase
- Submit button
- On submit, navigate to View 2 and trigger the animation

### View 2: Animated Screen

- Fixed 16:9 aspect ratio layout
- Submitted text should animate across the screen
- Support for up to 5 active animations at a time
- Each animation starts immediately after submission
- Motion and position of each animated text should be randomized
- When the 6th submission happens, the oldest animation should be removed

---

## ⚙️ Tech Stack

- **React** with **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router DOM** for view routing
- Optional: **Zustand** or **Context API** for managing active animated texts

---

## 🔧 Core Functionality

- [ ] View 1 with input field and navigation logic
- [ ] View 2 with 16:9 container and animated elements
- [ ] Animate text immediately on submit
- [ ] Random motion behavior for each new animation
- [ ] Maximum of 5 concurrent text animations
- [ ] Remove oldest animation when new one exceeds the limit

---

## ✨ Optional Enhancements

- [ ] Fade-out or scale-down animation after a few seconds
- [ ] Neon or glowing text styles using Tailwind
- [ ] Click-to-remove animation tags
- [ ] Subtle background animations (e.g. CSS gradients or particles)
- [ ] Reset button on View 2 to clear all animations
- [ ] Responsive behavior with proper scaling on smaller screens

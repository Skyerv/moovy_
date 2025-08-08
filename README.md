# Moovy 
Moovy is an Angular-based movie explorer app that lets you browse upcoming movies, popular movies by genre, and search for any movie. It uses The Movie Database (TMDb) API to fetch movie data and offers a smooth, responsive UI.

![alt text](https://github.com/Skyerv/moovy_/blob/master/public/mockup.png?raw=true)
---

## 🚀 How to Run

1. Clone this repository:

```bash
git clone https://github.com/Skyerv/moovy_.git
cd moovy
```

2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm start
```
4. Open your browser and navigate to:
```bash
http://localhost:4200
```

## 🎯 Features
### Upcoming Movies
Browse a carousel of movies coming soon.

### Popular Movies by Genre
Explore popular movies grouped by genres like Action, Comedy, Drama, Sci-fi, and Horror.

### Movie Search
Search for any movie by typing a title (minimum 3 characters). Results update with pagination support.

### Movie Details
View detailed info and cast of a selected movie via a dialog.

## ⚙️ Technical Details
### State Management
Uses NgRx Store and Effects for managing app state and side effects like API calls.

### Lazy Loading
Routes and components are lazy-loaded to optimize initial load time.

### Routing
Angular Router handles navigation, including nested routes for movie details.

### Global Variables
Centralized global variables (e.g., genre IDs, API endpoints) are stored in a dedicated config file for easy maintenance.

### Responsive Design
Media queries and Angular Material responsive layout ensure the app looks great on all screen sizes.

### Standalone Components
Some components use Angular’s standalone component API for modularity and simplicity.

## 📚 Technologies Used
- Angular 20+
- Angular Material
- NgRx (Store, Effects)
- RxJS
- TMDb API

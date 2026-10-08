# Lab 5 — DOM Store

## Project

This is a simple scooter rental store made with JavaScript and the browser DOM. A `Store` class keeps the products, and the page displays and updates them.

## How to open

Open `index.html` directly in a web browser. No development server is required.

## Features

- DOM rendering of products from the `Store` class
- Add a product with name, price, and quantity
- Validation messages displayed next to the form fields
- Delete a product
- Increase or decrease product quantity
- Live total calculated by `Store.total()`
- Event delegation for product action buttons

## Events I handled

I handled the form `submit` event so a product can be checked and added without reloading the page. I handled `input` events to update validation messages as I correct the fields. I used one delegated `click` event on the product table body for the increase, decrease, and delete buttons.

## AI tools used

AI assistance was used during development and verification of this project.

## Screenshot

![Scooter Rental Store application](screenshots/lab5.png)

Lab 5 verification`nThe application was tested with 22 passing Vitest tests.

The project includes a screenshot of the working application.
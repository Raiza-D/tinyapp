# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Logged in view. Table listing short URLs and corresponding long URLs, along with Edit and Delete functionalities."](https://github.com/Raiza-D/tinyapp/blob/main/docs/TinyApp-LoggedIn-Index.png?raw=true)
!["Logged in view of page where can update the long URL for an existing short URL."](https://github.com/Raiza-D/tinyapp/blob/main/docs/TinyApp-LoggedIn-EditUrl.png?raw=true)
!["The Register page where users can register for a TinyApp account."](https://github.com/Raiza-D/tinyapp/blob/main/docs/TinyApp-Register.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Side Notes
- `cookie-parser` is NOT needed as a Dependency. Purposely left it installed as a package and listed in my `package.json` file for project evaluation purposes only during my time at Lighthouse Labs. This package was required at the starting stages of the project's development, but was then replaced with `cookie-session`.
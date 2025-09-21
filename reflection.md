In this project, I built a Node.js backend connected to a Supabase PostgreSQL database. I structured the code to use environment variables stored in a .env file and excluded sensitive files with .gitignore to keep the project secure and clean. The main server file manages the application flow, and the database configuration ensures a secure SSL connection.

Along the way, I experimented with seed files and test scripts to verify queries and endpoints. As the project matured, I removed unnecessary files to keep the repository organized and professional.

A major challenge I faced was a persistent database connection error (ENOTFOUND) on my local machine. After troubleshooting, I confirmed this was caused by DNS/network restrictions rather than an error in the code. This taught me the importance of testing in different environments and documenting setup steps clearly so that others can reproduce the project successfully.

From this process, I learned:

How to configure a PostgreSQL database connection in Node.js.

How to manage environment variables and secure them with .gitignore.

How to troubleshoot real-world network and database issues.

The value of keeping a codebase clean and maintainable.

Overall, the project strengthened my backend development skills and gave me practical experience in debugging, documentation, and delivering a working solution under deadline pressure.
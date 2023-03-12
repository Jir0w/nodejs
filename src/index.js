const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const booksRouter = require("./routes/book");

const PORT = process.env.PORT || 3000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ books: [] }).write();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "FRT IT API",
			version: "1.0.0",
			description: "A simple API for FRT IT",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
const app = express();

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.db = db;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
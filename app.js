let express = require("express")
let app = express()
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_auth'
});
connection.connect();
app.set("view engine", "ejs")

app.get('/', function (req, res) {
    let { email, password, deid, edit } = req.query

    var edits = {}
    if (email && password) {
        if (edit) {
            let Update_data = `UPDATE data SET email ='${email}',password='${password}' WHERE id = ${edit}`;
            connection.query(Update_data, function (error, results) {
                if (error) throw error;
            });
        } else {
            let Insert_query = `INSERT into data (email,password) VALUES ('${email}','${password}')`
            connection.query(Insert_query, function (error, results) {
                if (error) throw error;
            })
        }
        return res.redirect('/')
    }
    if (deid) {
        let Delete_query = `DELETE FROM data WHERE id = ${deid}`;
        connection.query(Delete_query, function (error, results) {
            if (error) throw error;
        });

        return res.redirect('/');
    }
    else {
        let SELECT_Query = `SELECT * FROM data`
        connection.query(SELECT_Query, function (error, results) {
            if (error) throw error;
            if (edit >= 0) {
                edits = results.find((el) => el.id == edit)
            }
            res.render("index", { data: results, edits, edit })
        })
    }
})
app.listen(4000)
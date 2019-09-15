import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const base = "https://99lib.net/book/"

function save(bookId, file) {

    if (! fs.existsSync(bookId)) {
        fs.mkdirSync(bookId)
    }

    let filepath = path.join(bookId, file)
    if (fs.existsSync(filepath)) {
        return new Promise(resolve => resolve(filepath))
    }

    let url = base + bookId + '/' + file
    console.log(url)

    return fetch(url)
        .then(resp => {
            if (resp.status >= 400) {
                throw new Error("Bad http response from server")
            }
            return resp.text()
        })
        .then(text => {
            return new Promise((resolve) => {
                fs.writeFile(filepath, text, (err) => {
                    if (err) {
                        throw new Error("Error when writing file :" + err)
                    }
                    resolve(filepath)
                })
            })
        })
}

export default save
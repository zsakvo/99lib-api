import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import decode from './lib/decode'
import save from './save'

/**
 * read the index.html and return a list of chapiters
 */
function toc(path) {
    return new Promise((resolve) => {

        fs.readFile(path, (err, data) => {
            let chaps = []
            let $ = cheerio.load(data);

            $("#dir dd a").each((i, elem) => {
                let href = $(elem).attr('href')
                chaps.push(href.split('\/')[3])
            })

            resolve(chaps)
        })
    })
}

/**
 * Open the chapiter html file, decode and generate a 
 * markdown string for pandoc
 */
function mkchap(filename) {

    var data = fs.readFileSync(filename)

    var $ = cheerio.load(data);
    var client = $("meta[name=client]").attr("content");
    var content = $("#content");

    var title = $("#c_title").text()

    var text = decode(
        '<div id="content">' + content.html() + "</div>",
        client
    );

    return "# " + title + "\n\n" + text
}

var bookId = process.argv[2]

save(bookId, 'index.htm')
    .then(filename => toc(filename))
    .then(async (chaps) => {

        let outfile = bookId + ".md"
        if (fs.existsSync(outfile)) {
            fs.unlinkSync(outfile)
        }

        for (let chap of chaps) {
            let filename = await save(bookId, chap)
            let content = mkchap(filename)

            fs.appendFileSync(outfile, content)
        }
    })

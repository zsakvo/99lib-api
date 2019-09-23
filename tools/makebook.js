import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import decode from '../lib/decode'
import save from './save'

/**
 * read the index.html and return a list of chapiters
 */
function meta(path) {
    return new Promise((resolve) => {

        fs.readFile(path, (err, data) => {
            let $ = cheerio.load(data);

            let chaps = []
            $("#dir dd a").each((i, elem) => {
                let href = $(elem).attr('href')
                chaps.push(href.split('\/')[3])
            })
            
            let title  = $("#book_info h2").text()
            let author = $("#book_info h4").first().find("a").text()
            let desc   = $("#book_info .intro").children().text()

            resolve({
                title : title,
                author: author,
                desc: desc,
                chapiters: chaps
                })
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

function mkmeta(title, author, desc) {
    let outfile = title + ".yml"

    if (fs.existsSync(outfile)) {
        fs.unlinkSync(outfile)
    }

    let c = "---\n"
    c += "title:\n"
    c += "- type: main\n"
    c += "  text: " + title + "\n"
    c += "creator:\n"
    c += "- role: author\n"
    c += "  text: " + author + "\n"
    c += "identifier:\n"
    c += "- scheme: DOI\n"
    c += "  text: doi:10.234234.234/33\n"
    c += "lang: zh\n"
    c += "description: " + desc + "\n"
    c += "rights: 99lib.net\n"
    c += "ibooks:\n"
    c += "  version: 1.3.4\n"

    fs.appendFileSync(outfile, c)
}

var bookId = process.argv[2]

save(bookId, 'index.htm')
    .then(filename => meta(filename))
    .then(async (meta) => {

        mkmeta(meta.title, meta.author, meta.desc)

        let outfile = meta.title + ".md"
        if (fs.existsSync(outfile)) {
            fs.unlinkSync(outfile)
        }

        for (let chap of meta.chapiters) {
            let filename = await save(bookId, chap)
            let content = mkchap(filename)

            fs.appendFileSync(outfile, content)
        }

        return meta.title
    })
    .then((title) => {
        console.log("Now build the epub file with pandoc")
        console.log("pandoc -s --metadata-file " + title + ".yml -o " + title + ".epub " + title + ".md ")
    })

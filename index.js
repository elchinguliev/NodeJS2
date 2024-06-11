// const hello = "Hello World";
// console.log(hello);

//Blocking , synchronous
// const fs = require('fs');
// const textIn = fs.readFileSync('./txt/start.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about Node.Js : ${textIn}
// Created on ${Date.now()}
// `;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log("File written")

//  Non-blocking   , asynchronous


// const fs = require('fs');
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{

//     if(err){
//         return console.log(`Error : ${err}`)
//     }

//     console.log(data1);
//     fs.readFile('./txt/output.txt','utf-8',(err,data2)=>{
//         console.log(data2);

//         fs.writeFile('./txt/final.txt','Test Final','utf-8',err=>{
//             console.log(`Ended`);
//         })
//     })
// });

// console.log('Already read');

//Simple Web Server


const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};


const http = require('http');
const url = require('url');
const fs = require('fs');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

var data = fs.readFileSync(`${__dirname}/devdata/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    //const pathName = req.url;

    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    }
    // Product Page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    // API
    else if (pathname === '/api') {
        fs.readFile(`${__dirname}/devdata/data.json`, 'utf-8', (err, data) => {
            const productData = JSON.parse(data);
            console.log(productData);
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(data);
        });
    }
    // Not found
    else {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello World'
        });

        res.end('<h1 style="color:red;"> Page Not Found </h1>');

    }
})

server.listen(27002, '127.0.0.1', () => {
    console.log('Listening to requests on port 27001');
})


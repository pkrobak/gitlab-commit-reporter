const fs = require('fs');
const cheerio = require('cheerio');

const filePath = 'output.json';
const htmlName = 'template.html';

fs.readFile(htmlName, 'utf8', (err, html) => {
    if (err) {
        console.error('Błąd podczas czytania pliku:', err);
        return;
    }

    const $ = cheerio.load(html);
    const commitsList = $('#commits-list');

    if (commitsList.length === 0) {
        console.error('Nie znaleziono elementu o ID "commits-list"');
        return;
    }

    const report = {};
    let currentDay = null;

    commitsList.find('li').each((index, element) => {
        const el = $(element);
        const day = el.attr('data-day');
        if (typeof day !== 'undefined') {
            currentDay = day
            if (typeof report[day] === 'undefined') {
                report[day] = []
            }
        } else {
            report[currentDay].push({
                commit_id: el.attr('id'),
                href: 'https://gitlab.com' + el.find('a.commit-row-message').attr('href')
            })
        }

    })

    console.log('Success')

    const jsonData = JSON.stringify(report);

    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Błąd podczas zapisywania pliku:', err);
            return;
        }
        console.log('Dane zostały zapisane do pliku:', filePath);
    });
});
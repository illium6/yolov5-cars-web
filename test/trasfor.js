const fs = require('fs');

fs.readFile('C:\\Users\\toxik\\OneDrive\\Рабочий стол\\datasets\\Поликлинника\\filtred_dataset\\filtred_dataset\\KomPol2-7 — копия.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const dataObj = JSON.parse(data)

    dataObj.annotations = dataObj.annotations.filter(item => item.category_id !== 12)

    fs.writeFile('C:\\Users\\toxik\\OneDrive\\Рабочий стол\\datasets\\Поликлинника\\filtred_dataset\\filtred_dataset\\KomPol2-7 — копия.json', JSON.stringify(dataObj), err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
});
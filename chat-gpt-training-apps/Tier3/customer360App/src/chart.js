export function chartScript(data) {
    return `
    const newChart = function (labels, data, info) {
        const chart = {
            type: "bar",
            data: { labels: labels, datasets: [data] },
            options: {
                scales: {
                    x: {},
                    y: {
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: info,
                    },
                },
            },
        };
        return chart;
    };
    const createChart = async function () {

        let data1 = {labels:${JSON.stringify(data.api.labels)},values:[${data.api.values}]}
        let data2 = {labels:${JSON.stringify(data.storage.labels)},values:[${data.storage.values}]}
        let data3 = {labels:${JSON.stringify(data.index.labels)},values:[${data.index.values}]}
        let data4 = {labels:${JSON.stringify(data.queryTime.labels)},values:[${data.queryTime.values}]}
        let data5 = {labels:${JSON.stringify(data.stream.labels)},values:[${data.stream.values}]}

        const ctx1 = document.getElementById("myChart1").getContext("2d");
        const ctx2 = document.getElementById("myChart2").getContext("2d");
        const ctx3 = document.getElementById("myChart3").getContext("2d");
        const ctx4 = document.getElementById("myChart4").getContext("2d");
        const ctx5 = document.getElementById("myChart5").getContext("2d");


        const myChart5 = new Chart(
            ctx5,
            newChart(data5.labels, dataSets(data5), "STREAMio")
        );
        const myChart2 = new Chart(
            ctx2,
            newChart(data2.labels, dataSets(data2), "DISK Storage in MB")
        );
        const myChart1 = new Chart(
            ctx1,
            newChart(
                data1.labels,
                dataSets(data1),
                '"API operations"'
            )
        );
        
        const myChart3 = new Chart(
            ctx3,
            newChart(data3.labels, dataSets(data3), "IDEXstorageinMB")
        );
        
        const myChart4 = new Chart(
            ctx4,
            newChart(data4.labels, dataSets(data4), "QUERYexeTimeinSec")
        );
    };
    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
    const randomRGB = () => "rgb(133, 133, 235)";
    const dataSets = function (data) {
        let d = [];
        let b = [];
        for (let i in data.labels) {
            d.push(data.values[i]);
            b.push(randomRGB());
        }
        let all = { data: d, backgroundColor: b };
        return all;
    };

    createChart()
    `
}
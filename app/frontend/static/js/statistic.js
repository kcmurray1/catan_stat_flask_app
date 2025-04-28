
// Create bar chart using chart.js
class MyBarChart
{
    constructor(barData)
    {
        // Create canvas for chart
        this.canvas = CreateElement({
            name: "canvas",
            id: "playerRollsChart"
        })

        let test = this.canvas.getContext('2d');
        // Create chart

        const BAR_COLORS = ["red", "green","blue","orange","brown", "yellow", "purple", "black", "gray", "violet", "teal"];

        this.chart = new Chart(test, {
        type: "bar",
        data: {
            datasets: [{
                backgroundColor: BAR_COLORS,
                data: barData
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scale: {
              ticks: {
                precision: 0
              }
            },
            scales:{
                x: {
                    title: {
                      display: true,
                      text: 'Roll'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Roll Count'
                    }
                }
            }
           
        }
        });
    }


    
}
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

/**
 * Parse date string in yyyy-mm-dd format.
 *
 * Date() doesn't parse strings properly.
 * For example, if you pass a string directly in:
 * Date('2021-07-01'), Date() will return 2021 06 30.
 */
export function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}


/**
* Get the days between endDate and startDate.
* Place those days in daysInRange.
*/
export function getTotalDays(endDate, startDate) {
  let dateDecrement = endDate
  let daysInRange = []
  daysInRange.push(endDate)
  for (let i = 0; daysInRange[i] > startDate; i++) {
    dateDecrement.setDate((dateDecrement.getDate() - 1))
    daysInRange.push(dateDecrement)
    dateDecrement = new Date(dateDecrement)
  }

  /**
  * Check if the date range looks correct.
  */
  console.log(`daysInRange:`)
  console.log(JSON.stringify(daysInRange))

  return daysInRange = daysInRange.reverse()

}


/**
 * Build the month increments.
 */
export function getMonthList(daysInRange) {
  let monthList = []
  for (let i = 0; i < daysInRange.length; i++) {
    /**
    * Get the current month and the following month
    * Push them to matchList
    */
    if (monthList[monthList.length - 1]) {
      const comparison = monthList[monthList.length - 1].getMonth() ==
                          daysInRange[i].getMonth()
      if (!comparison) {
        monthList.push(daysInRange[i])
      }
    } else {
      monthList.push(daysInRange[0])
    }
  }

  /**
  * Check if monthList looks correct.
  */
  console.log(`monthList:`)
  console.log(monthList)

  return monthList
}


/**
 * Build the month increments.
 */
export function getMonthRanges(monthList, dates) {
  let monthRanges = []
  for (let i = 0; i < monthList.length; i++) {
    if(monthList[i] !== monthList[monthList.length] && monthList[i + 1] !== undefined) {
      const monthRange = {
        // x: monthList[i].toISOString().split('T')[0] + " - " +
        //     monthList[i + 1].toISOString().split('T')[0],
        x: [monthList[i], monthList[i + 1]],
        y: 0
      }
      monthRanges.push(monthRange)
    } else if (monthList[i] !== monthList[monthList.length] && monthList[i + 1] === undefined) {
      /**
      * Fill in the last month.
      */
      const secondToLastMonth = new Date(monthList[i])
      const lastMonth = secondToLastMonth.setMonth(monthList[i].getMonth() + 1)
      const monthRange = {
        x: [monthList[i], lastMonth],
        y: 0
      }
      monthRanges.push(monthRange)
    }
  }

  /**
  * Check if the month ranges look correct.
  */
  // console.log(`monthRanges:`)
  // console.log(monthRanges)

  /**
  * Determine how many of the given dates are in each bucket.
  */
  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < monthRanges.length; j++) {
      if (dates[i] >= monthRanges[j].x[0] && dates[i] <= monthRanges[j].x[1]) {
        monthRanges[j].y += 1
      }
    }
  }

  /**
  * Check the result
  */
  console.log(`monthRanges updated:`)
  console.log(monthRanges)

  return monthRanges
}


/**
 * Plot a histogram of the results
 */
export function makeMonthListHistogram(monthList, monthRanges) {
  const labels = monthList.map((month) => {
    return month.toLocaleString(
      'default',
      {month: 'long'}
    )
  })

  const backgroundColors = monthRanges.map((month, index) => {
      return `hsla(${((360) * index)/(monthRanges.length)}, ${100}%, ${69}%,  0.4)`
  })

  const borderColors = monthRanges.map((month, index) => {
    return `hsla(${((360) * index)/(monthRanges.length)}, ${100}%, ${69}%,  1)`
  })

  const data = {
    labels: labels,
    datasets: [{
      label: '# of dates in date range',
      data: monthRanges.map((date) => {
        return date.y
      }),
      backgroundColor: backgroundColors
      ,
      borderColor: borderColors,
      borderWidth: 1
    }]
  }

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  }

  const histogram = new Chart(
    document.getElementById('histogram'),
    config
  )

  return histogram
}


export default function dateTimeChallenge(endDate, startDate, dateList) {
  /**
  * Convert startDate and endDate, so we can get the date range
  */
  startDate = parseDate(startDate)
  endDate = parseDate(endDate)

  /**
  * Convert dateList to dates objects.
  */
  const dates = dateList.map((date) => {
    return parseDate(date)
  })

  const totalDays = getTotalDays(endDate, startDate)
  const monthList = getMonthList(totalDays)
  const monthRanges = getMonthRanges(monthList, dates)

  makeMonthListHistogram(monthList, monthRanges)
}

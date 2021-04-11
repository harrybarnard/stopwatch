/**
 * Stopwatch class.
 *
 * Allows the tracking of time elapsed, and the storage of lap times.
 */
class StopWatch {

    constructor() {
        // The date the stopwatch started.
        this.startDate = null;
        // Is the stopwatch running?
        this.isRunning = false;
        // The total time elapsed.
        this.totalTime = 0;
        // The date the last lap started.
        this.lastLap = null;
    }

    /**
     * Get the current time.
     *
     * @returns integer
     */
    time() {
        if (this.isRunning) {
            return this._getRunningTotal();
        }

        return this.totalTime;
    }

    /**
     * Start the stopwatch.
     */
    start() {
        if(!this.isRunning) {
            this.isRunning = true;
            this.startDate = Date.now();
            this.lastLap = Date.now();
        };
    }

    /**
     * Pause the stopwatch.
     */
    pause() {
        if(this.isRunning) {
            this.isRunning = false;
            this.totalTime = this.totalTime + this._getElapsed();
        }
    }

    /**
     * Reset the stopwatch.
     */
    reset() {
        this.totalTime = 0;

        if (this.isRunning) {
            this.startDate = Date.now();
            this.lastLap = Date.now();
        } else {
            this.startDate = null;
        }
    }

    /**
     * End current lap and store time.
     *
     * @returns Storage|null
     */
     lap() {
        if(this.isRunning) {
            let key = localStorage.length;

            localStorage.setItem(key, this._getLapElapsed());
    
            this.lastLap = Date.now();
    
            return localStorage.getItem(key);
        }

        return null;
    }

    /**
     * Get the lap times from storage.
     *
     * @returns [Storage]
     */
    laps() {
        let laps = [],
            keys = Object.keys(localStorage),
            i = 0, key;
    
        for (; key = keys[i]; i++) {
            laps.push({[key]: localStorage.getItem(key)});
        }

        return laps;
    }

    /**
     * 
     * @returns 
     */
    _getElapsed() {
        return Date.now() - this._getStartDate();
    }

    /**
     * Get the current running total.
     *
     * @returns integer
     */
    _getRunningTotal() {
        return this.totalTime + this._getElapsed();
    }

    /**
     * Get the date the stopwatch was started.
     *
     * @returns Date|null
     */
    _getStartDate() {
        if (!this.startDate) {
            return null;
        }

        return this.startDate;
    }

    

    /**
     * Get the time elapsed for the current lap.
     *
     * @returns integer
     */
    _getLapElapsed() {
        if(this.lastLap) {
            return Date.now() - this.lastLap;
        }

        return 0;
    }
}

$(document).ready(function() {

    /**
     * The stopwatch class.
     */ 
    const stopWatch = new StopWatch();

    /**
     * The current counter.
     */ 
    let counter = null;

    /**
     * Convert a number to a time string (hh:mm:ss:mss).
     *
     * @return String
     */
    Number.prototype.toTime = function() {
        let pad = (n, z = 2) => ('00' + n).slice(-z);
        return pad(this / 3.6e6 | 0) + ':' + pad((this % 3.6e6) / 6e4 | 0) + ':' + pad((this % 6e4) / 1000 | 0) + '.' + pad(this % 1000, 3);
    };

    /**
     * Start the counter.
     */
    function startCounter() {
        counter = setInterval(function() {
            const miliseconds = Math.round(stopWatch.time());
            $('.sw-time').html(miliseconds.toTime());
        }, 1);
    }

    /**
     * Stop the counter.
     */
    function stopCounter() {
        if(counter) {
            clearInterval(counter);
        }
    }

    /**
     * Render the lap times from storage.
     */
    function renderLaps() {
        stopWatch.laps().forEach(function(log) {
            renderLap(Object.values(log)[0]);
        })
    }

    /**
     * Render the given lap time.
     *
     * @param {string} lap 
     */
    function renderLap(lap) {
        let time = parseFloat(lap);
        $('.laps > table > tbody').prepend('<tr><td> ' + time.toTime() + '</td></tr>');
    }

    /**
     * Deal with Start button click.
     */
    $('.sw-start').on('click', function() {
        startCounter();
        stopWatch.start();
        $('.sw-start').attr('disabled', true);
        $('.sw-pause').attr('disabled', false);
        $('.sw-reset').attr('disabled', false);
        $('.sw-lap').attr('disabled', false);
    })

    /**
     * Deal with Pause button click.
     */
    $('.sw-pause').on('click', function() {
        stopCounter();
        stopWatch.pause();
        $('.sw-pause').attr('disabled', true);
        $('.sw-lap').attr('disabled', true);
        $('.sw-start').attr('disabled', false);
    })

    /**
     * Deal with a Stop button click.
     */
    $('.sw-reset').on('click', function() {
        stopCounter();
        stopWatch.reset();
        $('.sw-time').html('00:00:00.000');
        $('.sw-pause').attr('disabled', true);
        $('.sw-reset').attr('disabled', true);
        $('.sw-lap').attr('disabled', true);
        $('.sw-start').attr('disabled', false);
    })

    /**
     * Deal with a Lap button click.
     */
    $('.sw-lap').on('click', function() {
        if(lap = stopWatch.lap()) {
            renderLap(lap);
        }
    })

    /**
     * Deal with a Clear Laps button click.
     */
    $('.sw-clear').on('click', function() {
        stopWatch.lap();
        localStorage.clear();
        $('.laps > table > tbody').html('');
    })

    renderLaps();

});
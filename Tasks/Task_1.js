/* Task 1
  * Choose array fn (map/filter/filterMap/some/find/findIndex) (map)
  * Prepare its callback based async counterpart
  * Prepare demo cases for the usage
*/
// callback based async counterpart

function mapWithCallback(array, callback, finalCallback) {
    const results = [];
    let processed = 0;

    array.forEach((item, index) => {
        callback(item, (error, result) => {
                if (error) {
                 console.error(error.message);
                 results[index] = null;
                } else {
                    results[index] = result;
                }

            processed++;
            if (processed === array.length) {
                finalCallback(results);
            }
        });
    });
}

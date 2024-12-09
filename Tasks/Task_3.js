//Task 3

function promiseMap(array, fn, signal) {
    const promises = array.map((item) => {
        if (signal.aborted) {
            return Promise.reject(new DOMException("Aborted", "Abort_Error"));
        }

        return new Promise((resolve, reject) => {
            const onAbort = () => reject(new DOMException("Aborted", "Abort_Error"));

            signal.addEventListener("abort", onAbort, { once: true }); // (eventType, callback, options) 

            fn(item)
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    signal.removeEventListener("abort", onAbort); // (eventType, callback, options)
                });
        });
    });

    return Promise.all(promises);
}

async function demoFunc() {
    const controller = new AbortController();
    const { signal } = controller; // const signal = controller.signal;

    // case 1
    const numbers = [1, 2, 3, 4, 5];

    const promiseTriple = (num) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(num * 3), Math.random() * 1000);
        });
    };

    try {
        const res1 = await promiseMap(numbers, promiseTriple, signal);
        console.log("Case 1:", res1);
    } catch (err) {
        if (err.name === "Abort_Error") {
            console.error("Case 1 was aborted");
        } else {
            console.error("Error:", err);
        }
    }

    controller.abort();

    // case 2
    const numbers2 = [10, 20, 30];

    const promiseSquare = (num) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(num * num), Math.random() * 1000);
        });
    };

    try {
        const res2 = await promiseMap(numbers2, promiseSquare, signal);
        console.log("Case 2:", res2);
    } catch (err) {
        if (err.name === "Abort_Error") {
            console.error("Case 2 was aborted");
        } else {
            console.error("Error:", err);
        }
    }
}

demoFunc().then(() => {
    console.log("demoFunc completed successfully");
}).catch(err => {
    console.error("Error in demoFunc:", err);
});

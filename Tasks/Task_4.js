// Ongoing processing of large data sets that do not fit in memory

// with controller.abort();

async function* asyncGenerator(array) {
    for (const item of array) {
        yield new Promise((resolve) =>
            setTimeout(() => resolve(item), Math.random() * 1000)
        );
    }
}

async function asyncMap(asyncIterable, callback, signal) {
    const res = [];

    for await (const item of asyncIterable) {
        if (signal.aborted) {
            throw new DOMException("Aborted", "Abort_Error");
        }
        console.log(await callback(item))
        res.push(await callback(item));
    }

    return res;
}

async function demoFunc() {
    const controller = new AbortController();
    const { signal } = controller;

    const numbers = [1, 2, 3, 4, 5];
    const promiseTriple = (num) => Promise.resolve(num * 3);

    try {
        const iterable = asyncGenerator(numbers);

        setTimeout(() => {
            console.log("Aborting...");
            controller.abort();
        }, 1500);

        const res1 = await asyncMap(iterable, promiseTriple, signal);
        console.log("Case 1 results:", res1);
    } catch (err) {
        if (err.name === "Abort_Error") {
            console.error("Case 1 was aborted");
        } else {
            console.error("Error:", err);
        }
    }
}

demoFunc()
    .then(() => console.log("demoFunc completed successfully"))
    .catch((err) => console.error("We got Error in demoFunc:", err));

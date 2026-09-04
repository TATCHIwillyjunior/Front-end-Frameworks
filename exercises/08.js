// ## Part 2 — Modules, Array Methods, async/await, Optional Chaining
// ### Exercise 8 — async/await
// Run this file in the browser console or with Node 18+.

const BASE_URL = "https://jsonplaceholder.typicode.com";

// 1. Write an async function fetchPosts() that:
//    - fetches BASE_URL + "/posts"
//    - parses the JSON response
//    - returns the first 5 items
//    - logs each item's title


// 2. Add try/catch to fetchPosts().
//    If the fetch fails, log "Failed to load posts".
async function fetchPosts() {
    try {
        const res = await fetch(BASE_URL + "/posts")
        const data = await res.json()
        const firstFive =  data.slice(0,5)

        firstFive.forEach(element => 
            console.log(element.title)
        
        );
        return firstFive
    } catch {
        console.log("Failed to load posts");
        return [];
    }
  
}

// 3. Write an async function getPostById(id) that:
//    - fetches BASE_URL + "/posts/" + id
//    - throws an Error if res.ok is false
//    - returns the parsed JSON object
async function getPostById(id) {
    try {
        const res = await fetch(BASE_URL + "/posts/" + id)
        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }
        return await res.json()
        
    } catch {
        console.log("Failed to load posts");
        throw error
    }  
    
}

// Call getPostById(1) and log the result.
// Call getPostById(99999) — what happens? Handle it.

(async () => {
  try {
    console.log(await getPostById(1));
  } catch {
    console.log("Error on id 1");
  }

  try {
    console.log(await getPostById(99999));
  } catch(error) {
    console.log({msg: "something wrong with ID", error: error?.message});
  }
})();


export function useSaveAsPost() {
const saveAsPost = async ({ prompt, content, platform }: any) => {
try {
const res = await fetch("/api/posts/from-chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ prompt, content, platform }),
});


const data = await res.json();
return data;
} catch (err) {
console.error("Error saving post:", err);
throw err;
}
};


return { saveAsPost };
}
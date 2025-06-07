<template>
  <h1>Test Prompt</h1>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-4">Venice AI Mini App</h1>
      <textarea
        v-model="prompt"
        class="w-full p-3 border rounded-md mb-4"
        rows="4"
        placeholder="Enter your prompt here..."
      ></textarea>
      <button
        @click="submitPrompt"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        :disabled="loading || !prompt"
      >
        {{ loading ? "Loading..." : "Submit" }}
      </button>
      <div v-if="response" class="mt-6">
        <h2 class="text-lg font-semibold mb-2">Response:</h2>
        <p class="whitespace-pre-line">{{ response }}</p>
      </div>
    </div>
  </div>


  <h1>Get Cast and Replies</h1>
  <div class="p-4">
    <input v-model="castHash" placeholder="Enter Cast Hash" class="border p-2 mb-2 w-full" />
    <button @click="fetchCast" class="bg-purple-500 text-white p-2 rounded">Fetch Cast</button>

    <div v-if="cast" class="mt-4">
      <h2 class="text-lg font-bold">Post by @{{ cast.author.username }}</h2>
      <p>{{ cast.text }}</p>

      <div class="mt-4">
        <h3 class="font-semibold">Replies:</h3>
        <ul class="list-disc ml-4">
          <li v-for="reply in replies" :key="reply.hash">
            <strong>@{{ reply.author.username }}:</strong> {{ reply.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {onMounted, ref} from 'vue';
  import axios from "axios";

  const prompt = ref("Can you please summarize this post https://farcaster.xyz/jessepollak/0x439ba144");
  const response = ref("");
  const loading = ref(false);

  const submitPrompt = async () => {
    if (!prompt.value) return;

    loading.value = true;
    response.value = "";
    try {
      const res = await axios.post("/api/venice", {
        prompt: prompt.value,
      });
      response.value = res.data.result || "No response received.";
    } catch (err) {
      response.value = "Error: " + (err.response?.data?.message || err.message);
    } finally {
      loading.value = false;
    }
  };

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer V_Ps9XwXgaWHRXKJzYXAPxE3dFrSUev4aanxozu9ds");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const castHash = ref('');
  const cast = ref(null);
  const replies = ref([]);

  const fetchCast = async () => {
    try {
      const fullHash = await resolveFullCastHash(castHash.value)
      console.log('fullHash ==>', fullHash);
      const res = await axios.get(`/api/cast/${fullHash}`);
      cast.value = res.data.cast;
      replies.value = res.data.replies;
    } catch (err) {
      console.error('Error fetching cast:', err);
    }
  };

  const resolveFullCastHash = async (shortUrl) => {
    const res = await fetch('/api/resolve-cast-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: shortUrl }),
    });

    if (!res.ok) {
      throw new Error('Failed to resolve cast hash');
    }

    const data = await res.json();
    return data.fullHash;
  };

  onMounted(() => {
    fetch("https://api.venice.ai/api/v1/models", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log(result)

          const r = JSON.parse(result);
          const data = r.data;

          data.forEach(element => {
            console.log(element.id);
          })
        })
        .catch((error) => console.error(error));
  })
</script>

<style scoped>
  body {
    font-family: system-ui, sans-serif;
  }
</style>

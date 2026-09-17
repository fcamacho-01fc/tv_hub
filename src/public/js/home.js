async function loadUser() {
  const response = await fetch("/api/users/me");
  if (!response.ok) {
    location.href = "/login";
    return;
  }
  const user = await response.json();
  document.querySelector("#welcome").textContent =
    `Welcome, ${user.email} (${user.role})`;
}

const channelList = document.querySelector("#channel-list");
const channelStatus = document.querySelector("#channel-status");
const searchInput = document.querySelector("#channel-search");

function createChannelCard(channel) {
  const card = document.createElement("article");
  card.className = "channel-card";

  const logo = document.createElement("img");
  // TODO 3:
  // Muestra la URL del logo del canal actual.
  // Pista: ¿Qué propiedad de Channel guarda la URL del logo?
  logo.src = "https://placehold.co/160x90/e5e7eb/111827?text=TODO+3";
  logo.alt = `${channel.name} logo`;
  logo.className = "channel-logo";

  const name = document.createElement("h3");
  // TODO 2:
  // Muestra el nombre del canal actual.
  // Pista: Revisa el objeto que devuelve GET /api/channels.
  name.textContent = "TODO 2";

  const country = document.createElement("p");
  // MISIÓN OPCIONAL A:
  // Muestra el país del canal actual.
  // Pista: ¿Qué propiedad de Channel guarda el país?
  country.textContent = "MISIÓN OPCIONAL A";
  country.className = "channel-country";

  const categories = document.createElement("p");
  // TODO 4:
  // Convierte el arreglo de categorías en texto legible.
  // Ejemplo: ["News", "General"] a "News , General"
  categories.textContent = "TODO 4";
  categories.className = "channel-categories";

  card.append(logo, name, country, categories);
  return card;
}

function displayChannels(channels) {
  channelList.replaceChildren(...channels.map(createChannelCard));
  channelStatus.textContent = `${channels.length} channel${channels.length === 1 ? "" : "s"} from MongoDB`;
}

async function loadChannels(search = "") {
  channelStatus.textContent = "Loading channels from the backend…";
  // TODO 5:
  // Envía el valor actual de búsqueda al backend.
  // Pista: el backend ya acepta ?search=...
  const query = search ? `?${new URLSearchParams({ search: "TODO 5" })}` : "";
  const response = await fetch(`/api/channels${query}`);

  if (!response.ok) {
    channelStatus.textContent = "Could not load channels.";
    return;
  }

  const { channels } = await response.json();
  displayChannels(channels);
}

searchInput.addEventListener("input", () => loadChannels(searchInput.value));
document.querySelector("#logout").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  location.href = "/login";
});
loadUser();
loadChannels();

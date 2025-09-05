const API_URL =
        "https://crudcrud.com/api/5c20be15930043fcbba4f07470a18657/bookings";

      async function fetchBookings() {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderBookings(data);
      }

      function renderBookings(bookings) {
        const list = document.getElementById("bookingList");
        list.innerHTML = "";
        bookings.forEach((b) => {
          const div = document.createElement("div");
          div.className = "booking";

          div.innerHTML = `
      <span id="name-${b._id}"><b>${b.username}</b></span>
      <span id="seat-${b._id}">Seat: ${b.seatNumber}</span>
      <button onclick="deleteBooking('${b._id}')">Delete</button>
      <button onclick="enableEdit('${b._id}', '${b.username}', '${b.seatNumber}')">Edit</button>
    `;
          list.appendChild(div);
        });
        document.getElementById("totalCount").innerText = bookings.length;
      }

      async function addBooking() {
        const username = document.getElementById("username").value.trim();
        const seatNumber = document.getElementById("seatNumber").value.trim();
        if (!username || !seatNumber) {
          alert("Please fill all fields");
          return;
        }

        const res = await fetch(API_URL);
        const bookings = await res.json();
        if (bookings.some((b) => b.seatNumber == seatNumber)) {
          alert("Seat already booked!");
          return;
        }

        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, seatNumber }),
        });
        document.getElementById("username").value = "";
        document.getElementById("seatNumber").value = "";
        fetchBookings();
      }

      async function deleteBooking(id) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchBookings();
      }

      function enableEdit(id, oldName, oldSeat) {
        const nameEl = document.getElementById(`name-${id}`);
        const seatEl = document.getElementById(`seat-${id}`);

        nameEl.innerHTML = `<input id="edit-name-${id}" value="${oldName}">`;
        seatEl.innerHTML = `Seat: <input id="edit-seat-${id}" value="${oldSeat}">`;

        // Replace buttons with Save/Cancel
        const parentDiv = nameEl.parentNode;
        parentDiv.querySelector("button:nth-child(3)").remove(); // delete btn stays
        parentDiv.querySelector("button").insertAdjacentHTML(
          "afterend",
          `
    <button onclick="saveEdit('${id}')">Save</button>
    <button onclick="fetchBookings()">Cancel</button>
  `
        );
      }

      async function saveEdit(id) {
        const newName = document.getElementById(`edit-name-${id}`).value.trim();
        const newSeat = document.getElementById(`edit-seat-${id}`).value.trim();
        if (!newName || !newSeat) return;

        const res = await fetch(API_URL);
        const bookings = await res.json();
        if (bookings.some((b) => b.seatNumber == newSeat && b._id !== id)) {
          alert("Seat already booked!");
          return;
        }

        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: newName, seatNumber: newSeat }),
        });
        fetchBookings();
      }

      async function searchSeat() {
        const seat = document.getElementById("searchSeat").value.trim();
        const res = await fetch(API_URL);
        const bookings = await res.json();
        const found = bookings.find((b) => b.seatNumber == seat);
        document.getElementById("searchResult").innerText = found
          ? `${found.username} has booked seat ${seat}`
          : "No booking found.";
      }

      fetchBookings();
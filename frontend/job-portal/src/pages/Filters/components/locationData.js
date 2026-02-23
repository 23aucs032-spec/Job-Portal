const rawLocations = [

  // ===== METRO CITIES =====
  "Bangalore / Bengaluru",
  "Mumbai",
  "Delhi",
  "New Delhi",
  "Gurgaon",
  "Noida",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",

  // ===== TAMIL NADU (ALL DISTRICTS) =====
  "Ariyalur",
  "Chengalpattu",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanniyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "The Nilgiris",
  "Theni",
  "Thiruvallur",
  "Thiruvarur",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvannamalai",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",

  // ===== KARNATAKA =====
  "Mysore",
  "Mangalore",
  "Hubli",
  "Belgaum",
  "Electronic City",
  "Whitefield",

  // ===== MAHARASHTRA =====
  "Navi Mumbai",
  "Thane",
  "Nagpur",
  "Nashik",
  "Aurangabad",

  // ===== GUJARAT =====
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",

  // ===== UTTAR PRADESH =====
  "Lucknow",
  "Kanpur",
  "Ghaziabad",
  "Greater Noida",
  "Agra",
  "Varanasi",

  // ===== TELANGANA =====
  "Cyberabad",
  "Warangal",

  // ===== ANDHRA PRADESH =====
  "Visakhapatnam",
  "Vijayawada",

  // ===== KERALA =====
  "Kochi",
  "Trivandrum",
  "Kozhikode",

  // ===== PUNJAB =====
  "Chandigarh",
  "Mohali",
  "Ludhiana",
  "Amritsar",

  // ===== RAJASTHAN =====
  "Jaipur",
  "Udaipur",
  "Jodhpur",

  // ===== MADHYA PRADESH =====
  "Indore",
  "Bhopal",
  "Gwalior",

  // ===== ODISHA =====
  "Bhubaneswar",
  "Cuttack",

  // ===== JHARKHAND =====
  "Ranchi",
  "Jamshedpur",

  // ===== NORTH EAST =====
  "Guwahati",

  // ===== REMOTE =====
  "Remote",
  "Work From Home",
  "Hybrid",
  "Anywhere in India"

];

/* Convert into { name, count } format */
const locations = rawLocations.map((name) => ({
  name,
  count: Math.floor(Math.random() * 2000) + 50 // demo job count
}));

export default locations;
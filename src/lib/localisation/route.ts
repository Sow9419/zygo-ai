import { NextResponse } from "next/server"

export async function GET() {
  //const fields = ["status", "country", "city", "lat", "lon"].join(",")

  const fields = "country";
  

  const data = await fetch(`http://ip-api.com/json`)
  console.log("-----> localisation data: " + data)
  const ip = await fetch(`http://ip-api.com/json`)
    .then((res) => res.json())
    //.then((data) => console.log("-----> localisation data: " +data))
    .then((data) => data?.ip)
   .catch((err) => console.error(err))

  try {
    // Appel à ip-api avec IP réelle
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=${fields}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "ZYGO Search Application",
      },
      next: { revalidate: 1 }, // Cache d'une heure
    })

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Réponse non-JSON reçue:", text)
      return NextResponse.json({ error: "Format de réponse invalide" }, { status: 500 })
    }

    if (!response.ok) {
      return NextResponse.json({ error: `Erreur API: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()

    if (data.status === "success") {
      return NextResponse.json({
        country: data.country,
        city: data.city,
        location: {
          lat: data.lat,
          lon: data.lon,
        },
      })
    } else {
      return NextResponse.json({ error: "Échec de la localisation" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la localisation:", error)

    return NextResponse.json({
      country: "Localisation",
      city: "Indisponible",
      location: {
        lat: 48.8566,
        lon: 2.3522,
      },
      isFallback: true,
    })
  }
}
const API_URL = 'http://localhost:3000';

export async function getExperienceItems() {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/experience-items`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch experience items');
    return res.json();
}

export async function addExperienceItem(item: string) {
    const token = localStorage.getItem('token');
    console.debug("Adding experience item:", item);

    const res = await fetch(`${API_URL}/experiences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item }),
    });

    if (!res.ok) throw new Error('Failed to add experience item');
    return res.json();
}
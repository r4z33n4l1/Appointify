export async function fetchCalendarStatusUsernamesAndIds(accessToken, calendarId, status) {
    console.log('fetchCalendarStatusUsernamesAndIds', accessToken, calendarId, status);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}notify/calendars/status/?status=${status}&calendar_id=${calendarId}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      // Extracting usernames and IDs from the response
      const userDetails = data.results.map(item => item.usernames).flat().map(user => ({
        name: user[0],
        id: user[1],
      }));
      console.log('userDetails', userDetails);
      return userDetails;
    } catch (error) {
      console.error('Error fetching calendar status usernames and IDs:', error);
      throw error;
    }
  }
  

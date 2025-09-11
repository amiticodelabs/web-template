const moment = require("moment");
const { getISdk } = require("../api-util/sdk");

const weekDays = [
    { label: 'Sunday', key: 'sun' },
    { label: 'Monday', key: 'mon' },
    { label: 'Tuesday', key: 'tue' }, 
    
    { label: 'Wednesday', key: 'wed' },
    { label: 'Thursday', key: 'thu' },
    { label: 'Friday', key: 'fri' },
    { label: 'Saturday', key: 'sat' },
]
module.exports = async (req, res) => {
    const sdk = getISdk();
    try {
        const { listingId } = req.body;
        // Support both plain UUID strings and SDK UUID objects
        const id = typeof listingId === 'object' && listingId?.uuid ? listingId.uuid : listingId;

        if (!id) {
            return res.status(400).json({ error: 'listingId is required' });
        }

        // Fetch listing with author relationship so we can reach provider profile
        const { data: listingRes } = await sdk.listings.show({ id, include: ['author'] });
        const listing = listingRes.data;

        // Author relationship key can be 'author' or 'owner' depending on marketplace setup
        const authorRel = listing.relationships?.author || listing.relationships?.owner;
        const authorId = authorRel?.data?.id;

        if (!authorId) {
            return res.status(200).json({ entries: [] });
        }

        // Fetch provider profile to get default availability plan
        const { data: userRes } = await sdk.users.show({ id: authorId });
        const profilePlan = userRes?.data?.attributes?.profile?.publicData?.availabilityPlan;
        console.log(userRes?.data?.attributes?.profile?.publicData, "profile")
        const entities = Array.isArray(profilePlan?.entries) ? profilePlan.entries : [];

        const groupedByDay = entities.reduce((acc, curr) => {
            const { dayOfWeek, startTime, endTime } = curr;

            if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = { dayOfWeek: weekDays.find(w => w.key == dayOfWeek)?.label, time: [] };
            }

            acc[dayOfWeek].time.push({ startTime: moment(startTime, "HH:mm").format("h:mm A"), endTime: moment(endTime, "HH:mm").format("h:mm A") });
          console.log(acc , "acc")
            return acc;
        }, {});
        const result = Object.values(groupedByDay);
        return res.status(200).json({ entries: result });
    } catch (err) {
        console.log(err, "ERROR");
        return res.status(400).json({ err });
    }
};
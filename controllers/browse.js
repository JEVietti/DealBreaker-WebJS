const Browse = require('../models/browse')

// Get All Profiles
function getProfiles (req, res) {
    Browse.getAll((err, profiles) => {
        if(err) {
            res.json({success: false, profiles: null})

        } else if (profiles != null) {
            res.json({success: true, profiles: profiles})
        } else {
            res.json({success: false, profiles: null})            
        }
    })
}

module.exports.getAll = getProfiles

const i18n = require('i18n');
const {getGoogleAccountFromCode,checkSignIn} = require('../middlewares/google');
const Settings = require('../models/settings');
exports.googleLogin = async (req,res,next) => {
    const _id = await checkSignIn(req,await getGoogleAccountFromCode(req.query.code));
    req.session._id = _id;
    Settings.findOne({fromUser:_id},function(err,settings){
        if(err) console.trace();
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
};
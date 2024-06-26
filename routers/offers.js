
const express = require('express');
const admin = require('../middlewares/admin');
const upload = require('../middlewares/upload_image');
const OfferSchema = require('../models/offers');
const handleValidationError = require('../middlewares/error_handler');

const router = express.Router();

router.post('/api/v1/add-offer', admin, upload.single('banner'), async (req, res) => {
    try {
        // Check if an offer already exists for the product
        const existingOffer = await OfferSchema.findOne({ product: req.body.product });
        
        if (existingOffer) {
            return res.status(400).json({ message: 'This offer already exists' });
        }

        // Create a new offer model
        const offer = new OfferSchema({
            banner: req.file.path,
            product: req.body.product
        });

        // Save the new offer
        await offer.save();

        // Populate the product field in the offer model
    //    await offer.populate('product');

        return res.status(200).json({ status: 'success', added_offer: offer });
    } catch (error) {
        handleValidationError(error, req, res);
    }
});


router.get('/api/v1/get-offers' , async (req,res)=> {
      const offers = await OfferSchema.find().populate('product');
      try {
       return res.status(200).json({status:'success', offers : offers});
      } catch (error) {
        return res.status(500).json({message : error});
      }
});

router.get('/api/v1/get-offer/:id', async (req, res )=> {
    const existedOffer = await OfferSchema.findById({_id : req.params.id});
    try {
         if(!existedOffer) return res.res({message: 'This is offer is not available anymore !'});
        
         return res.status(200).json({status : 'success', offer : existedOffer});
    } catch (error) {
        return res.status(500).json({message : error});
    }
}); 

router.delete('/api/v1/delete-offer/:id', admin, async (req, res) => {
    try {
        const existOffer = await OfferSchema.findById(req.params.id);
        if (!existOffer) {
            return res.json({ message: 'This offer is not available anymore!' });
        }
        const deletedOffer = await OfferSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: 'success', deleted_offer: deletedOffer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;
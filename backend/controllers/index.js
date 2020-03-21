export const add = (name, model) => (req, res) => {
  const body = req.body;
  if (!body)
    return res.status(400).json({
      success: false,
      error: `Provide a ${name}`
    });

  const instance = new model(body);
  if (!instance)
    return res.status(400).json({
      success: false,
      error: err
    });

  instance
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: instance._id,
        message: `${name} created!`
      });
    })
    .catch(err => {
      return res.status(400).json({
        err,
        message: `${name} created!`
      });
    });
};

export const update = (name, model) => async (req, res) => {
  const body = req.body;
  if (!body)
    return res.status(400).json({
      success: false,
      error: "Prove a body to update"
    });

  model.findOne({ _id: req.params.id }, (err, instance) => {
    if (err)
      return res.status(404).json({
        err,
        message: `${name} not found!`
      });
    for (var key in body) {
      instance[key] = bod[key];
    }
    instance
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: instance._id,
          message: `${name} updated!`
        });
      })
      .catch(err =>
        res.status(404).json({
          err,
          message: `${name} not updated!`
        })
      );
  });
};

export const del = (name, model) => async (req, res) => {
  await model
    .findOneAndDelete({ _id: req.params.id }, (err, instance) => {
      return err || !instance
        ? res
            .status(400)
            .json({ success: false, error: err || `${name} not found` })
        : res.status(200).json({ success: true, data: instance });
    })
    .catch(err => console.error(err));
};

export const get_by_id = (name, model) => async (req, res) => {
  await model
    .findOne({ _id: req.params.id }, (err, instance) => {
      return err || !instance
        ? res
            .status(400)
            .json({ success: false, error: err || `${name} not found` })
        : res.status(200).json({ success: true, data: instance });
    })
    .catch(err => console.error(err));
};

export const get_all = (name, model) => async (req, res) => {
  await model
    .find({}, (err, instances) => {
      return err || !instances.length
        ? res
            .status(404)
            .json({ success: false, error: err || `${name} not found` })
        : res.status(200).json({ success: true, data: instances });
    })
    .catch(err => console.error(err));
};

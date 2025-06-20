const { admin, db } = require("../model/db");


const signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            disabled: false
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
  const { fullName, bio } = req.body;
  const { uid } = req;

  try {
    // 1. Update Firebase Auth displayName
    await admin.auth().updateUser(uid, { displayName: fullName });

    // 2. Update Firestore profile data
    await db.collection("users").doc(uid).set(
      {
        fullName,
        bio,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Profile update failed" });
  }
};

const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const uid = req.uid;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Password update failed:", err);
    return res.status(500).json({ error: "Password update failed" });
  }
};


module.exports = {
    signUp,
    updateProfile,
    updatePassword
}
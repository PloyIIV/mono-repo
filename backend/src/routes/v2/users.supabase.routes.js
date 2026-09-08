import { Router } from "express";
import { supabase } from "../../config/supabaseClient.js";

export const router = Router();

const PG_SELECT = "id, username, email, role, created_at, updated_at";

// Read users
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select(PG_SELECT);
    if (error) throw error;

    return res.json(data);
  } catch (error) {
    next(error);
  }
});

// Create user
router.post("/", async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;
    const { success, error } = await supabase
      .from("users")
      .insert([{ username, password, email, role, created_at: new Date() }]);
    if (!success) throw error;
    return res.json({
      message: "Created user successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const checkUser = await supabase.from('users').select().eq('id', req.params.id)
    if(checkUser.error) {
        return res.status(400).json({
            message: `ERROR: ${checkUser.error.message}`
        })
    }
    if(checkUser.data.length === 0) {
        return res.json({
            message: "Cannot find this user id"
        })
    }

    const { data, error } = await supabase
      .from("users")
      .update(req.body)
      .eq("id", req.params.id).select();
    if (error) throw error;
    
    return res.json(data)
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const checkUser = await supabase.from('users').select().eq('id', req.params.id)
    if(checkUser.error) {
        return res.status(400).json({
            message: `ERROR: ${checkUser.error.message}`
        })
    }
    if(checkUser.data.length === 0) {
        return res.json({
            message: "Cannot find this user id"
        })
    }

    const { success, error } = await supabase.from("users").delete().eq("id", req.params.id);
    if(!success) throw error

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
});

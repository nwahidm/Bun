import { type NextFunction, type Request, type Response } from "express"
import { User } from "../models/users"
import { getToken } from "../helpers/jwt"
import type { JWTRequest } from "../middlewares/middlewares"
import { createLog } from "./log_activities"
import { Kewengangan } from "../models/kewenangan"
// const url = "http://192.168.40.2:5025/"
const url = "http://paket2.kejaksaan.info:5025/"


export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[]
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, nama_lengkap, nip, jenis_kelamin } = req.body
    let avatar
    if (req.files) {
        avatar = (req.files as MulterFiles)['avatar'][0].path
    }
    console.log("[REGISTER USER]", username, email, password, nama_lengkap, nip, jenis_kelamin, avatar)

    try {
        //Check whether the user already exists or not
        const checkUserEmail = await User.findOne({ email })
        const checkUserUsername = await User.findOne({ username })

        if (checkUserEmail || checkUserUsername) {
            throw {
                name: "Already Exist",
                message: "Username atau email sudah terdaftar"
            }
        }

        if (!password) {
            throw {
                name: "Password Validation",
                message: "Password must have at least 6 characters"
            }
        } else if (password.length < 6) {
            throw {
                name: "Password Validation",
                message: "Password must have at least 6 characters"
            }
        }

        const hashPassword = await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 4,
        })

        const newUser = new User({
            username,
            email,
            password: hashPassword,
            nama_lengkap,
            nip,
            jenis_kelamin,
            kewenangan_id: "65b0bed13ef8cf0cd2ea3223",
            avatar,
            enabled: false
        })

        await newUser.save()

        res.status(201).json({
            status: 201,
            message: "User baru terdaftar"
        })
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, browser, os, ip } = req.body
    console.log("[LOGIN USER]", username, password, browser, os, ip)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findOne({ username })

        if (!targetUser) {
            throw {
                name: "Invalid",
                message: "Username atau password salah"
            }
        }

        //Check whether the password is correct
        const isMatch = await Bun.password.verify(password, targetUser!.password)

        if (!isMatch) {
            throw {
                name: "Invalid",
                message: "Username atau password salah"
            }
        }

        //Check whether the user status is active or not
        if (targetUser.enabled == false) {
            throw {
                name: "Not Active",
                message: "Akun anda belum diaktivasi, silakan lakukan aktivasi terlebih dahulu"
            }
        }

        const user = {
            _id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            avatar: url + targetUser.avatar,
            browser,
            os,
            ip
        }

        //Get Access_token
        const access_token = await getToken(user, "3 days")

        const log = {
            activity: `Login`,
            user_id: targetUser._id,
            browser,
            os,
            ip
        }

        //Create Log
        await createLog(log)

        res.status(200).json({
            status: 200,
            data: {
                user,
                access_token
            }
        })
    } catch (error) {
        next(error)
    }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[ACTIVATE USER]", _id)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(_id)

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        //Activate user by updating user enabled to be true
        await User.updateOne({ _id }, { $set: { enabled: true } })

        res.status(200).json({
            status: 200,
            message: `Akun dengan username ${targetUser.username} berhasil diaktifkan`
        })
    } catch (error) {
        next(error)
    }
}

export const userProfile = async (req: JWTRequest, res: Response, next: NextFunction) => {
    console.log("[USER PROFILE]")

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(req.user?._id).populate("kewenangan_id")

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        const user = {
            _id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            nama_lengkap: targetUser.nama_lengkap,
            nip: targetUser.nip,
            jenis_kelamin: targetUser.jenis_kelamin,
            avatar: url + targetUser.avatar,
            kewenangan_id: targetUser.kewenangan_id
        }

        res.status(200).json({
            status: 200,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { _id, browser, os, ip } = req.user!
    const { username, password, email, nama_lengkap, nip, jenis_kelamin } = req.body
    let avatar
    if (req.files) {
        avatar = (req.files as MulterFiles)['avatar'][0].path
    }
    console.log("[UPDATE PROFILE]", username, password, email, nama_lengkap, nip, jenis_kelamin, avatar)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(_id)

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (username) updatedData = { ...updatedData, username }
        if (email) updatedData = { ...updatedData, email }
        if (password) {
            const hashPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 4,
            })

            updatedData = { ...updatedData, hashPassword }
        }
        if (avatar) updatedData = { ...updatedData, avatar }
        if (nama_lengkap) updatedData = { ...updatedData, nama_lengkap }
        if (nip) updatedData = { ...updatedData, nip }
        if (jenis_kelamin) updatedData = { ...updatedData, jenis_kelamin }

        //Update Profile
        await User.updateOne({ _id }, { $set: updatedData })

        const log = {
            activity: `Update Profile`,
            user_id: _id,
            browser,
            os,
            ip
        }

        //Create Log
        await createLog(log)

        res.status(200).json({
            status: 200,
            message: `${targetUser.username} berhasil memperbaharui profile`
        })
    } catch (error) {
        next(error)
    }
}

export const fetchAllUsers = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { username, email, limit, offset } = req.body
    console.log("[FETCH ALL USERS]", username, email, limit, offset)

    try {
        //Search query
        let where = {}
        if (username) where = { ...where, username }
        if (email) where = { ...where, email }

        const users = await User.find(where).skip(offset).limit(limit).populate('kewenangan_id', 'deskripsi')

        for (let i in users) {
            const user = users[i]

            user.avatar = url + user.avatar
        }

        res.status(200).json({
            status: 200,
            data: users
        })
    } catch (error) {
        next(error)
    }
}

export const fetchUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id
    console.log("[FETCH USER DETAIL]", _id)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(_id).populate("kewenangan_id")

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        const user = {
            _id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            nama_lengkap: targetUser.nama_lengkap,
            nip: targetUser.nip,
            jenis_kelamin: targetUser.jenis_kelamin,
            avatar: url + targetUser.avatar,
            kewenangan_id: targetUser.kewenangan_id
        }

        res.status(200).json({
            status: 200,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { _id, browser, os, ip } = req.user!
    const id = req.params.id
    const { username, email, password, repassword, nama_lengkap, nip, jenis_kelamin, kewenangan_id } = req.body
    let avatar
    if (req.file) {
        avatar = (req.files as MulterFiles)['avatar'][0].path
    }
    console.log("[UPDATE USER]", _id, id, username, email, password, repassword, nama_lengkap, nip, jenis_kelamin, kewenangan_id, avatar)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(id)

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        //Updated Data
        let updatedData = {}
        if (username) updatedData = { ...updatedData, username }
        if (email) updatedData = { ...updatedData, email }
        if (avatar) updatedData = { ...updatedData, avatar }
        if (password) {
            //Check whether the password is match with repassword or not
            if (password !== repassword) {
                throw {
                    name: "Didn't Match",
                    message: "Password dan repassword tidak sesuai"
                }
            }

            const hashPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 4,
            })

            updatedData = { ...updatedData, password: hashPassword }
        }
        if (nama_lengkap) updatedData = { ...updatedData, nama_lengkap }
        if (nip) updatedData = { ...updatedData, nip }
        if (jenis_kelamin) updatedData = { ...updatedData, jenis_kelamin }
        if (kewenangan_id) updatedData = { ...updatedData, kewenangan_id }

        //Update User
        await User.updateOne({ _id: id }, { $set: updatedData })

        const log = {
            activity: `Memperbaharui Profile User ${targetUser._id}`,
            user_id: _id,
            browser,
            os,
            ip
        }

        //Create Log
        await createLog(log)

        res.status(200).json({
            status: 200,
            message: `Akun ${targetUser.username} berhasil diperbaharui`
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const { _id, browser, os, ip } = req.user!
    const id = req.params.id
    console.log("[DELETE USER]", _id)

    try {
        //Check whether the user exists or not
        const targetUser = await User.findById(id)

        if (!targetUser) {
            throw {
                name: "Not Found",
                message: "User tidak ditemukan"
            }
        }

        await User.deleteOne({ _id: id })

        const log = {
            activity: `Menghapus User ${targetUser._id}`,
            user_id: _id,
            browser,
            os,
            ip
        }

        //Create Log
        await createLog(log)

        res.status(200).json({
            status: 200,
            message: `User dengan id ${_id} berhasil dihapus`
        })
    } catch (error) {
        next(error)
    }
}
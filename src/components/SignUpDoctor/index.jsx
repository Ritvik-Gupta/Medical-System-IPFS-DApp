import React, { useContext, useState } from "react"
import { MedicalSystemContext } from "../App"

export const SignUpDoctor = () => {
	const ctx = useContext(MedicalSystemContext)
	const [doctorName, setdoctorName] = useState("")
	const [doctorImage, setDoctorImage] = useState("")

	const onSubmitCreateDoctor = async event => {
		event.preventDefault()
		const res = await ctx.medicalSystem.methods
			.createDoctor(doctorName, doctorImage)
			.send({ from: ctx.account })
		console.log(res)
	}

	return (
		<form onSubmit={onSubmitCreateDoctor}>
			<label>
				Enter your name:
				<input
					type='text'
					value={doctorName}
					onChange={e => {
						setdoctorName(e.target.value)
					}}
				/>
			</label>
			<label>
				Img Url:
				<input
					type='text'
					value={doctorImage}
					onChange={e => {
						setDoctorImage(e.target.value)
					}}
				/>
			</label>

			<button>Submit</button>
		</form>
	)
}

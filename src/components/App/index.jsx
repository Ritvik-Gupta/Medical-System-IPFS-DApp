import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import React, { createContext, useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Web3 from "web3"
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js"
import MedicalSystem from "../../abis/MedicalSystem.json"
import GivePermission from "../GivePermission"
import { HomePage } from "../HomePage"
import ShowPatients from "../ShowPatients"
import { SignUpDoctor } from "../SignUpDoctor"
import SignUpPatient from "../SignUpPatient"
import UploadRecord from "../UploadRecord"
import ViewPatientRecords from "../ViewPatientRecords"

const ipfsStorage = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_KEY })

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}))

export const MedicalSystemContext = createContext()

export const App = () => {
	const [account, setAccount] = useState(null)
	const [medicalSystem, setMedicalSystem] = useState(null)
	const classes = useStyles()

	useEffect(() => {
		;(async () => {
			if (window.ethereum) {
				window.web3 = new Web3(window.ethereum)
				await window.ethereum.enable()
			} else if (window.web3) {
				window.web3 = new Web3(window.web3.currentProvider)
			} else {
				window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
			}

			const web3 = window.web3
			const accounts = await web3.eth.getAccounts()
			setAccount(accounts[0])
			const networkId = await web3.eth.net.getId()
			const networkData = MedicalSystem.networks[networkId]
			if (networkData) {
				setMedicalSystem(new web3.eth.Contract(MedicalSystem.abi, networkData.address))
			} else {
				window.alert("Medical System contract not deployed to detected network.")
			}
		})()
	}, [])

	return account === null || medicalSystem === null ? (
		<div style={{ textAlign: "center", marginTop: "30vh" }}>
			<CircularProgress />
		</div>
	) : (
		<div>
			<MedicalSystemContext.Provider value={{ ipfsStorage, account, medicalSystem }}>
				<BrowserRouter>
					<Routes>
						<Route path='/' exact element={<HomePage />} />
						<Route path='/patient/signup' exact element={<SignUpPatient />} />
						<Route path='/patient/upload-record' exact element={<UploadRecord />} />
						<Route path='/patient/give-permission' exact element={<GivePermission />} />
						<Route path='/doctor/show-patients' exact element={<ShowPatients />} />
						<Route path='/doctor/signup' exact element={<SignUpDoctor />} />
						<Route path='/doctor/:patientId/view-records' exact element={<ViewPatientRecords />} />
					</Routes>
				</BrowserRouter>
			</MedicalSystemContext.Provider>
		</div>
	)
}

import {
	Image,
	Text,
	View,
	Page,
	Document,
	StyleSheet,
} from "@react-pdf/renderer";
import { Fragment } from "react";

const Invoice = ({notes, dateStart, dateEnd, user}) => {
	const styles = StyleSheet.create({
		page: {
			fontSize: 11,
			paddingTop: 20,
			paddingLeft: 40,
			paddingRight: 40,
			lineHeight: 1.5,
			flexDirection: "column",
		},

		spaceBetween: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			color: "#3E3E3E",
		},

		titleContainer: { flexDirection: "row", marginTop: 24 },

		logo: { width: 90 },

		reportTitle: { fontSize: 16, textAlign: "center" },

		addressTitle: { fontSize: 11, fontStyle: "bold" },

		invoice: { fontWeight: "bold", fontSize: 20 },

		invoiceNumber: { fontSize: 11, fontWeight: "bold" },

		address: { fontWeight: 400, fontSize: 10 },

		theader: {
			marginTop: 20,
			fontSize: 10,
			fontStyle: "bold",
			paddingTop: 4,
			paddingLeft: 7,
			flex: 1,
			height: 20,
			backgroundColor: "#DEDEDE",
			borderColor: "whitesmoke",
			borderRightWidth: 1,
			borderBottomWidth: 1,
		},

		theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

		tbody: {
			fontSize: 9,
			paddingTop: 4,
			paddingLeft: 7,
			flex: 1,
			borderColor: "whitesmoke",
			borderRightWidth: 1,
			borderBottomWidth: 1,
		},

		total: {
			fontSize: 9,
			paddingTop: 4,
			paddingLeft: 7,
			flex: 1.5,
			borderColor: "whitesmoke",
			borderBottomWidth: 1,
		},

		tbody2: { flex: 2, borderRightWidth: 1 },
	});

	const InvoiceTitle = () => (
		<View style={styles.titleContainer}>
			<View style={styles.spaceBetween}>
				<Text style={styles.reportTitle}>HealthMe</Text>
			</View>
		</View>
	);

	const Address = () => (
		<View style={styles.titleContainer}>
			<View style={styles.spaceBetween}>
				<View>
					<Text style={styles.invoice}>Report </Text>
				</View>
				<View>
					<Text style={styles.addressTitle}>
						{user.Fname} {user.Lname}
					</Text>
				</View>
			</View>
		</View>
	);

	const UserAddress = () => (
		<View style={styles.titleContainer}>
			<View style={styles.spaceBetween}>
				<View style={{ maxWidth: 200 }}>
					<Text style={styles.addressTitle}>Showing Notes For</Text>
					<Text style={styles.address}>
						{dateStart}
						{" - "}
						{dateEnd}
					</Text>
				</View>
			</View>
		</View>
	);

	const TableHead = () => (
		<View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
			<View style={[styles.theader, styles.theader2]}>
				<Text>Date Made</Text>
			</View>
			<View style={styles.theader}>
				<Text>Note</Text>
			</View>
		</View>
	);

	const TableBody = () =>
		notes.map((note) => (
			<Fragment key={note.id}>
				<View style={{ width: "100%", flexDirection: "row" }}>
					<View style={[styles.tbody, styles.tbody2]}>
						<Text>{note.date_created}</Text>
					</View>
					<View style={styles.tbody}>
						<Text>{note.Note} </Text>
					</View>
				</View>
			</Fragment>
		));

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<InvoiceTitle />
				<Address />
				<UserAddress />
				<TableHead />
				<TableBody />
			</Page>
		</Document>
	);
};

export default Invoice;
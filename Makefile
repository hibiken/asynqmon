assets:
	cd ./ui && yarn build

# TODO: Update this once go1.16 is released.
go_binary:
	go1.16rc1 build -o asynqmon .

# Target to build a release binary.
build: assets go_binary



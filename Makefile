assets:
	cd ./ui && yarn build

# TODO: Update this once go1.16 is released.
go_bin:
	go1.16beta1 build -o asynqmon .

# Target to build a release binary.
build: assets go_bin


